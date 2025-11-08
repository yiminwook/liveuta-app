import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
// import customParseFormat from "dayjs/plugin/customParseFormat";
// import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(utc);
dayjs.extend(timezone);
// dayjs.tz.setDefault("Asia/Seoul");
// dayjs.extend(customParseFormat);
// dayjs.extend(duration);
dayjs.extend(relativeTime);

export default dayjs;
