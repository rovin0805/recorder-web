export const formatTime = (time: number) => {
  const min = Math.floor(time / 60);
  const sec = time % 60;
  return `${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec}`;
};
