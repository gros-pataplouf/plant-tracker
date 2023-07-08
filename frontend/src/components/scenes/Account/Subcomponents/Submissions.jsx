import { Link } from "react-router-dom";

export default function Submissions({ props }) {
  const { submissions } = props;
  return (
    <div>
      <h1 className="my-6">My submissions</h1>
      <ul>
        {!submissions ? (
          <li>You have not submitted any data yet.</li>
        ) : (
          submissions.map((submission) => {
            return (
              <Link to={`/locations/${submission.id}`}>
                <li key={submission.id}>
                  📌 {new Date(submission.created_at).toLocaleString("en-GB")}{" "}
                  near {submission.display_name || "unknown address"}
                </li>
              </Link>
            );
          })
        )}
      </ul>
    </div>
  );
}
