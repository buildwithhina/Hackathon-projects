export function authDestination(value: string | null) {
  if (!value) return "/dashboard";
  if (value === "/my-registrations") return value;
  const match = /^\/register\?event=[0-9a-f-]{36}$/i.test(value);
  return match ? value : "/dashboard";
}
