class CodeGenerator
{
    private readonly maxLetters = [
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
        "G",
        "H",
        "I",
        "J",
        "K",
        "L",
        "M",
        "N",
        "O",
        "P",
        "Q",
        "R",
        "S",
        "T",
        "U",
        "V",
        "W",
        "X",
        "Y",
        "Z"
    ];

    private readonly minLetters = [
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
        "i",
        "j",
        "k",
        "l",
        "m",
        "n",
        "o",
        "p",
        "q",
        "r",
        "s",
        "t",
        "u",
        "v",
        "w",
        "x",
        "y",
        "z"
    ];

    private readonly specialCaracteres = [
        ".",
        "/",
        "?",
        "!",
        "#",
        "&",
        "$",
        "+",
        "-",
        "%",
        "../",
        ":",
        ";",
        "[",
        "]",
        "{",
        "}",
        "=",
        "_"
    ];

    private readonly numbers = [
        0,
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9
    ];

    private readonly allCaracteres = [
        ...this.maxLetters,
        ...this.minLetters,
        ...this.specialCaracteres,
        ...this.numbers
    ];

    public code: string;

    public constructor (_codeLength: number)
    {
        this.code = this.genCode(_codeLength);
    }

    private genCode (_codeLength: number): string
    {
        let code: string = undefined;

        for (let index = this.allCaracteres.length; index; index--)
        {
            const aleatoryIndex = Math.floor(Math.random() * index);

            const element = this.allCaracteres[index - 1];

            this.allCaracteres[index - 1] = this.allCaracteres[aleatoryIndex];

            this.allCaracteres[aleatoryIndex] = element;
        }

        const shuffledArray = [ ...this.allCaracteres ];

        const preCode = [];

        while (preCode.length < _codeLength)
        {
            const aleatoryIndex = Math.floor(Math.random() * (shuffledArray.length - 2 + 1));

            preCode.push(shuffledArray[aleatoryIndex]);
        }

        code = preCode.join("");

        return code;
    }
}

export { CodeGenerator };
