export const choices = ["сoin", "tail"];

export const flipCoin = (choices: string[]) => {
	return choices[Math.floor(Math.random() * choices.length)];
};
