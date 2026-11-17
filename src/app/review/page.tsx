import { redirect } from "next/navigation";

export default function ReviewRedirect() {
  redirect(
    "https://search.google.com/local/writereview?placeid=ChIJ-YDyLXhjYIcRACn32VIfjkY",
  );
}