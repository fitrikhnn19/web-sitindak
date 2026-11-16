import { redirect } from "next/navigation";

export default function DaftarPage() {
  redirect("/guru/masuk?mode=register");
}
