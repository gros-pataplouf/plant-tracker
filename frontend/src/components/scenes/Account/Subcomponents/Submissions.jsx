const classes = {
  title: "",
  submissions: "scroll",
};

export default function Submissions({ props }) {
  const { submissions } = props;
  return (
    <div className={classes.submissions}>
      <h3 className={classes.title}>My submissions</h3>
      <ul>
        {!submissions ? (
          <li>You have not submitted any data yet.</li>
        ) : (
          submissions.map((submission) => {
            return (
              <li key={submission.id}>
                📌 {new Date(submission.created_at).toLocaleString("en-GB")}{" "}
                near {submission.display_name || "unknown address"}
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
