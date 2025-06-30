export function getBaseRoute() {
  let baseRoute = "";
  if (
    window.microApp &&
    window.microApp.getData &&
    window.microApp.getData().baseroute
  ) {
    baseRoute = window.microApp.getData().baseroute;
  }
  return baseRoute;
}

export function getOrigin() {
  return location.origin + getBaseRoute();
}
