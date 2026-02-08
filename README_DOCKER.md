# Renford - PostgreSQL Docker Setup

## 🚀 Quick Start

### Local Development

```bash
# Start PostgreSQL and pgAdmin
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f postgres
```

### VPS Deployment

1. **Upload files to VPS:**
```bash
scp docker-compose.yml root@YOUR_VPS_IP:/opt/renford/
scp .env.database root@YOUR_VPS_IP:/opt/renford/.env
```

2. **SSH into VPS and start:**
```bash
ssh root@YOUR_VPS_IP
cd /opt/renford
docker-compose up -d
```

3. **Configure firewall (if needed):**
```bash
# UFW
sudo ufw allow 5432/tcp
sudo ufw allow 5050/tcp

# iptables
sudo iptables -A INPUT -p tcp --dport 5432 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 5050 -j ACCEPT
```

## 📝 Configuration

### Environment Variables

Edit `.env.database` file:

```env
POSTGRES_PASSWORD=your_strong_password_here
PGADMIN_EMAIL=your_email@domain.com
PGADMIN_PASSWORD=your_admin_password
```

### Database Connection

**From your application (renford-api):**

```env
# .env file in renford-api/
DATABASE_URL=postgresql://renford_user:renford_secure_password_2026@YOUR_VPS_IP:5432/renford_db
```

## 🔧 Services

### PostgreSQL
- **Port:** 5432
- **User:** renford_user
- **Database:** renford_db
- **Max Connections:** 200

### pgAdmin (Web UI)
- **URL:** http://YOUR_VPS_IP:5050
- **Email:** admin@renford.fr (default)
- **Password:** admin_password_2026 (default)

## 📊 Useful Commands

```bash
# Stop services
docker-compose down

# Stop and remove volumes (⚠️ deletes data)
docker-compose down -v

# Restart services
docker-compose restart

# View logs
docker-compose logs -f

# Backup database
docker exec renford-postgres pg_dump -U renford_user renford_db > backup_$(date +%Y%m%d).sql

# Restore database
docker exec -i renford-postgres psql -U renford_user -d renford_db < backup.sql

# Connect to PostgreSQL CLI
docker exec -it renford-postgres psql -U renford_user -d renford_db
```

## 🔐 Security Best Practices for VPS

1. **Change default passwords:**
   - Update `POSTGRES_PASSWORD` in `.env.database`
   - Update `PGADMIN_PASSWORD` in `.env.database`

2. **Limit access with firewall:**
   ```bash
   # Allow only from your API server IP
   sudo ufw allow from YOUR_API_SERVER_IP to any port 5432
   ```

3. **Use SSL/TLS (recommended for production):**
   - Configure PostgreSQL to require SSL connections
   - Update connection string: `DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require`

4. **Regular backups:**
   ```bash
   # Add to crontab for daily backups
   0 2 * * * docker exec renford-postgres pg_dump -U renford_user renford_db | gzip > /backups/renford_$(date +\%Y\%m\%d).sql.gz
   ```

5. **Monitor logs:**
   ```bash
   docker-compose logs -f postgres
   ```

## 🔄 Prisma Migration

After starting the database:

```bash
cd renford-api

# Push schema to database
npx prisma db push

# Or run migrations
npx prisma migrate dev

# Generate Prisma Client
npx prisma generate

# Open Prisma Studio
npx prisma studio
```

## 🌐 Remote Access Configuration

### For PostgreSQL:

The database is configured to accept connections from any IP (`listen_addresses=*`). Make sure your VPS firewall allows incoming connections on port 5432.

**Connection string from anywhere:**
```
postgresql://renford_user:renford_secure_password_2026@YOUR_VPS_IP:5432/renford_db
```

### For pgAdmin Web UI:

Access pgAdmin at: `http://YOUR_VPS_IP:5050`

**First time setup in pgAdmin:**
1. Login with your credentials
2. Right-click "Servers" → "Register" → "Server"
3. General tab: Name = "Renford DB"
4. Connection tab:
   - Host: `postgres` (if accessing from same Docker network) or `YOUR_VPS_IP`
   - Port: `5432`
   - Username: `renford_user`
   - Password: `renford_secure_password_2026`

## ⚠️ Important Notes

- **Data Persistence:** Database data is stored in Docker volume `postgres_data`
- **Port Conflicts:** Make sure ports 5432 and 5050 are not in use
- **Production:** Always change default passwords before deploying to VPS
- **Backups:** Set up automated backups for production data
- **SSL:** Consider enabling SSL for remote connections in production

## 🐛 Troubleshooting

**Can't connect to database:**
```bash
# Check if container is running
docker-compose ps

# Check logs
docker-compose logs postgres

# Test connection
psql postgresql://renford_user:renford_secure_password_2026@localhost:5432/renford_db
```

**Connection refused from remote:**
```bash
# Check firewall
sudo ufw status

# Check if PostgreSQL is listening
docker exec renford-postgres netstat -tlnp | grep 5432
```

**Reset everything:**
```bash
docker-compose down -v
docker-compose up -d
```
