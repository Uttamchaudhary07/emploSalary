import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { IndianRupee, Percent, ChevronDown, Calculator } from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";

function EditableField({ label, value, onChange, unit = "currency", rightSlot }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
        {label}
        {rightSlot}
      </div>
      <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 min-w-[140px] justify-end">
        {unit === "currency" ? (
          <IndianRupee className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
        ) : (
          <Percent className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
        )}
        <input
          type="number"
          min={0}
          value={value}
          onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
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

export default function TakeHomeCalculator({ defaultCTC = 0 }) {
  const [ctc, setCtc] = useState(Math.max(0, Math.round(defaultCTC)));
  const [bonusMode, setBonusMode] = useState("percentage"); // "percentage" | "fixed"
  const [bonusValue, setBonusValue] = useState(15);
  const [isBonusMenuOpen, setIsBonusMenuOpen] = useState(false);
  const [professionalTax, setProfessionalTax] = useState(200);
  const [employerPF, setEmployerPF] = useState(1800);
  const [employeePF, setEmployeePF] = useState(1800);
  const [additionalDeduction1, setAdditionalDeduction1] = useState(0);
  const [additionalDeduction2, setAdditionalDeduction2] = useState(0);

  const result = useMemo(() => {
    const monthlyCTC = ctc / 12;
    const monthlyBonus =
      bonusMode === "percentage" ? monthlyCTC * (bonusValue / 100) : bonusValue;

    const totalMonthlyDeductions =
      monthlyBonus + employerPF + employeePF + professionalTax + additionalDeduction1 + additionalDeduction2;

    const takeHomeMonthly = Math.max(0, monthlyCTC - totalMonthlyDeductions);
    const takeHomeAnnual = takeHomeMonthly * 12;
    const totalAnnualDeductions = totalMonthlyDeductions * 12;

    return { monthlyCTC, monthlyBonus, totalMonthlyDeductions, takeHomeMonthly, takeHomeAnnual, totalAnnualDeductions };
  }, [ctc, bonusMode, bonusValue, professionalTax, employerPF, employeePF, additionalDeduction1, additionalDeduction2]);

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
            Editable fields — adjust to match your actual offer
          </p>
        </div>
      </div>

      <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-700">
        <EditableField label="Cost to Company (CTC)" value={ctc} onChange={setCtc} />

        <EditableField
          label="Bonus Included in CTC"
          value={bonusValue}
          onChange={setBonusValue}
          unit={bonusMode === "percentage" ? "percent" : "currency"}
          rightSlot={
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsBonusMenuOpen((v) => !v)}
                className="flex items-center gap-1 text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline"
              >
                {bonusMode === "percentage" ? "Percentage" : "Fixed Amount"}
                <ChevronDown className="w-3 h-3" />
              </button>
              {isBonusMenuOpen && (
                <div className="absolute left-0 mt-1 w-36 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-large overflow-hidden z-20">
                  {[
                    { key: "percentage", label: "Percentage" },
                    { key: "fixed", label: "Fixed Amount" },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => {
                        setBonusMode(opt.key);
                        setIsBonusMenuOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          }
        />

        <EditableField
          label="Monthly Professional Tax"
          value={professionalTax}
          onChange={setProfessionalTax}
        />
        <EditableField label="Monthly Employer PF" value={employerPF} onChange={setEmployerPF} />
        <EditableField label="Monthly Employee PF" value={employeePF} onChange={setEmployeePF} />
        <EditableField
          label="Monthly Additional Deduction (Optional)"
          value={additionalDeduction1}
          onChange={setAdditionalDeduction1}
        />
        <EditableField
          label="Monthly Additional Deduction (Optional)"
          value={additionalDeduction2}
          onChange={setAdditionalDeduction2}
        />
      </div>

      <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700 divide-y divide-slate-100 dark:divide-slate-700">
        <ComputedRow label="Total Monthly Deductions" value={result.totalMonthlyDeductions} />
        <ComputedRow label="Total Annual Deductions" value={result.totalAnnualDeductions} />
        <ComputedRow label="Take Home Monthly Salary" value={result.takeHomeMonthly} emphasize />
        <ComputedRow label="Take Home Annual Salary" value={result.takeHomeAnnual} emphasize />
      </div>
    </motion.div>
  );
}
