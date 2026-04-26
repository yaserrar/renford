# Odoo SMS Architecture (Email Equivalent)

## Goal

Every email sent through the backend mail transport now triggers an equivalent SMS attempt through Odoo.

## Centralized Flow

1. Backend code calls `mail.sendMail(...)`.
2. Email is sent through Resend.
3. The same call automatically triggers SMS dispatch logic.
4. Recipient phone numbers are resolved from:

- `Utilisateur.telephone` by matching recipient email

5. SMS payload is built from the email subject + plain text body (or HTML stripped to text).
6. SMS is sent to Odoo using one of these modes:
   - Mode A: direct endpoint (`ODOO_SMS_ENDPOINT`)
   - Mode B: Odoo JSON-RPC (`ODOO_BASE_URL`, `ODOO_DB`, `ODOO_USERNAME`, `ODOO_PASSWORD`)

## Files

- `renford-api/src/config/mail.ts`
  - Email sending + automatic SMS equivalent trigger.
- `renford-api/src/config/odoo-sms.ts`
  - Odoo SMS transport client with endpoint and JSON-RPC modes.
- `renford-api/src/lib/sms-equivalent.ts`
  - SMS message generation and phone normalization.

## Environment Variables

```
ODOO_SMS_ENABLED=false
ODOO_SMS_SENDER=Renford
ODOO_SMS_MAX_LENGTH=320

# Mode A
ODOO_SMS_ENDPOINT=
ODOO_SMS_API_KEY=

# Mode B
ODOO_BASE_URL=
ODOO_DB=
ODOO_USERNAME=
ODOO_PASSWORD=
ODOO_SMS_MODEL=sms.sms
ODOO_SMS_METHOD=create_and_send
```

Recommended for Odoo Online:

- `ODOO_SMS_MODEL=sms.sms`
- `ODOO_SMS_METHOD=create_and_send`

The backend creates an `sms.sms` record and then automatically tries send methods (`send`, `_send`, `action_send`).

## Runtime Behavior

- SMS dispatch is best-effort and does not block email delivery.
- If no phone is found for an email recipient, the backend logs the skip and continues.
- If Odoo fails, the backend logs a warning and continues.

## Notes

- This architecture guarantees one SMS attempt for each email sent via `mail.sendMail`.
- For recipient emails not present in platform user records, no phone can be resolved automatically.
