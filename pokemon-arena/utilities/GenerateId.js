export default function GenerateId(min = 0, max = 1026) {
    return Math.floor(Math.random() * (max - min) + min);
}