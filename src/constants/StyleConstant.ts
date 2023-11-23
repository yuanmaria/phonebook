const breakpoints = [40, 48, 64, 80];

const mq = breakpoints.map((bp) => `@media (min-width: ${bp}em)`);

export default mq;