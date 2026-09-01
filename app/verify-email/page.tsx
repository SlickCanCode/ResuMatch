
import VerifyEmailPrompt from "@/components/VerifyEmailPrompt";
import VerifyOtpPage from "@/components/VerifyOtpPage";

type VerifyEmailPageProps = {
  searchParams: Promise<{
    email?: string;
    purpose?: string;
    step?: string;
  }>;
};

export default async function Page({ searchParams }: VerifyEmailPageProps) {
  const params = await searchParams;

  if (params.step === "otp") {
    return <VerifyOtpPage />;
  }

  return <VerifyEmailPrompt email={params.email ?? ""} purpose={params.purpose ?? "register"} />;
}