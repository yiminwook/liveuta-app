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
// 기본적으로 한국어 설정
dayjs.locale("ko"); //TODO: 언어 설정에 따라 변경필요

//한국어로 설정된 dayjs
export default dayjs;
