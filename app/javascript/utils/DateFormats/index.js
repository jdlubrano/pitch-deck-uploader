const dayjs = require("dayjs");
const localizedFormat = require('dayjs/plugin/localizedFormat')
dayjs.extend(localizedFormat)

export function formatDateTime(isoDateStr) {
  return dayjs(isoDateStr).format("LLL");
}
