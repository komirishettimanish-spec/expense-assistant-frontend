import { MONTHS } from '../../utils/format';

export default function PeriodSelect({ value, onChange }) {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let y = currentYear - 3; y <= currentYear + 1; y += 1) years.push(y);

  return (
    <div className="flex gap-2">
      <select
        className="input w-auto"
        value={value.month}
        onChange={(e) => onChange({ ...value, month: Number(e.target.value) })}
        aria-label="Month"
      >
        {MONTHS.map((name, index) => (
          <option key={name} value={index + 1}>
            {name}
          </option>
        ))}
      </select>
      <select
        className="input w-auto"
        value={value.year}
        onChange={(e) => onChange({ ...value, year: Number(e.target.value) })}
        aria-label="Year"
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
}
