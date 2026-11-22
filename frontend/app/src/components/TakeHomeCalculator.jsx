import { useState } from "react";
import { motion } from "framer-motion";
import { IndianRupee, Calculator } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";

function EditableField({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
        {label}
      </div>
      <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 min-w-[140px] justify-end">
        <IndianRupee className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
        <input
          aria-label={label}
          type="number"
          min={0}
          value={value}
          onChange={(event) => onChange(Math.max(0, Number(event.target.value)))}
          className="w-full bg-transparent text-right text-sm font-semibold text-emerald-700 dark:text-emerald-300 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
      </div>
    </div>
  );
}

function ComputedRow({ label, value, emphasize = false }) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <span
        className={cn(
          "text-sm",
          emphasize
            ? "font-semibold text-slate-900 dark:text-white"
            : "text-slate-500 dark:text-slate-400"
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          emphasize
            ? "text-lg font-bold text-emerald-600 dark:text-emerald-400"
            : "text-sm font-medium text-slate-700 dark:text-slate-300"
        )}
      >
        {formatCurrency(value)}
      </span>
    </div>
  );
}

export default function TakeHomeCalculator({ ctc, onCtcChange }) {
  const [annualExtras, setAnnualExtras] = useState(0);
  const [incomeTax, setIncomeTax] = useState(0);
  const [professionalTax, setProfessionalTax] = useState(0);
  const [employerPF, setEmployerPF] = useState(0);
  const [employeePF, setEmployeePF] = useState(0);
  const [otherDeductions, setOtherDeductions] = useState(0);

  const monthlyDeductions = incomeTax + professionalTax + employerPF + employeePF + otherDeductions;
  const takeHomeMonthly = Math.max(0, (ctc - annualExtras) / 12 - monthlyDeductions);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-soft"
    >
      <div className="flex items-center gap-2.5 mb-1">
        <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center flex-shrink-0">
          <Calculator className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Take-Home Salary Calculator
          </h3>
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Starts with the annual offer above. Enter any bonus, equity, or benefits included in CTC and paid outside your regular salary, plus deductions from your payslip.
          </p>
        </div>
      </div>

      <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-700">
        <EditableField label="Cost to Company (CTC)" value={ctc} onChange={onCtcChange} />
        <EditableField
          label="Annual pay outside your regular salary (optional)"
          value={annualExtras}
          onChange={setAnnualExtras}
        />
        <EditableField label="Monthly income tax withheld" value={incomeTax} onChange={setIncomeTax} />

        <EditableField
          label="Monthly Professional Tax"
          value={professionalTax}
          onChange={setProfessionalTax}
        />
        <EditableField label="Monthly Employer PF" value={employerPF} onChange={setEmployerPF} />
        <EditableField label="Monthly Employee PF" value={employeePF} onChange={setEmployeePF} />
        <EditableField label="Other monthly deductions" value={otherDeductions} onChange={setOtherDeductions} />
      </div>

      {annualExtras > ctc ? (
        <p role="alert" className="mt-4 text-sm text-red-600">Annual pay outside your regular salary cannot exceed CTC.</p>
      ) : (
        <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700">
          <ComputedRow label="Total monthly deductions" value={monthlyDeductions} />
          <ComputedRow label="Estimated regular monthly take-home" value={takeHomeMonthly} emphasize />
          <ComputedRow label="Estimated regular annual take-home" value={takeHomeMonthly * 12} emphasize />
        </div>
      )}
    </motion.div>
  );
}
