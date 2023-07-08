export function testMail(mail) {
  const re = /\S*@\S*\.[A-Za-z]/;
  return re.exec(mail);
}

export function testPassword(password) {
  const minlength = password.length >= 8;
  const re1 = /[A-Z]/;
  const re2 = /[a-z]/;
  const re3 = /[0-9]/;
  const re4 = /[^a-zA-Z0-9]/;
  return (
    minlength &&
    re1.exec(password) &&
    re2.exec(password) &&
    re3.exec(password) &&
    re4.exec(password)
  );
}

export function validateForm(e, message) {
  const invalidFields = e.target.querySelectorAll("input[invalid]");
  if (invalidFields.length) {
    window.alert(message);
    return false;
  } else {
  return true;}
  }