import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);
  return (
    <div id="error-page">
      <h2>{error.statusText || error.message}</h2>
      <img src={"https://http.cat/" + error.status} alt='' />
    </div>
  );
}
