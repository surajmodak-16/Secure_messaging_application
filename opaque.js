const users = {};

function opaqueRegisterInit({ username, password }) {
  const record = Buffer.from("record:" + password).toString("base64");
  return { record };
}

function opaqueRegisterFinish({ username, record }) {
  users[username] = { record };
  return { success: true };
}

function opaqueLoginInit({ username, password }) {
  const user = users[username];
  if (!user) return { success: false };
  const expected = Buffer.from("record:" + password).toString("base64");
  return { success: user.record === expected };
}

function opaqueLoginFinish({ username }) {
  return { success: !!users[username] };
}

module.exports = { opaqueRegisterInit, opaqueRegisterFinish, opaqueLoginInit, opaqueLoginFinish };