import DamageCalculatorMvp from "@/src/features/damage-calculator/DamageCalculatorMvp";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <DamageCalculatorMvp locale={locale} />;
}
