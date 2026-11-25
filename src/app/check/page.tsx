import { redirect } from "next/navigation";

export default function CheckRedirectPage() {
  redirect("/check-status");
}

