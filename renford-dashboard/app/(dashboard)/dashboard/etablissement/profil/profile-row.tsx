type ProfileRowProps = {
  label: string;
  value: string;
};

export default function ProfileRow({ label, value }: ProfileRowProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 py-4 border-t border-input text-sm">
      <p className="font-medium text-black">{label}</p>
      <p className="md:col-span-2 text-black whitespace-pre-wrap">
        {value || "-"}
      </p>
    </div>
  );
}
