import { IUser } from "../models";

class UserDocumentValidator
{
    public errors: Partial<IUser> = {};
    public document: string;

    private readonly cpfRegex = /\d{3}\.\d{3}\.\d{3}-\d{2}$||\d{11}/;
    private readonly cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/000[1|2]-\d{2}$|\d{14}/;

    public constructor (_document: string)
    {
        this.document = this.validate(_document);
    }

    private validate (_document: string): string
    {
        const document = _document.trim();

        // CPF without mask
        if (document.length === 11)
        {
            const validCpf = this.verifyCpf(document);

            if (validCpf)
            {
                return document.trim();
            }

            this.errors.document = "Invalid document!";

            return undefined;
        }
        // CNPJ with mask
        else if (document.length === 18)
        {
            const validCnpj = this.verifyCnpj(document);

            if (validCnpj)
            {
                return document.trim();
            }

            this.errors.document = "Invalid document!";

            return undefined;
        }
        // CPF with mask or CNPJ without mask
        else if (document.length === 14)
        {
            const validCpf = this.verifyCpf(document);

            if (validCpf)
            {
                return document.trim();
            }

            const validCnpj = this.verifyCnpj(document);

            if (validCnpj)
            {
                return document.trim();
            }

            this.errors.document = "Invalid document!";

            return undefined;
        }

        this.errors.document = "Invalid document!";

        return undefined;
    }

    private verifyCpf (_document: string):boolean
    {
        const cpf = _document.trim();

        if (typeof cpf === "string" && this.cpfRegex.test(cpf))
        {
            const strCPF = cpf.trim().replace(/[^\d]+/g, "");

            let sum = 0;
            let rest = undefined;

            if (strCPF === "00000000000")
            {
                return false;
            }

            for (let aux = 1; aux <= 9; aux++)
            {
                sum += parseInt(strCPF.substring(aux - 1, aux), 10) * (11 - aux);
            }

            rest = (sum * 10) % 11;
            if ((rest === 10) || (rest === 11))
            {
                rest = 0;
            }

            if (rest !== parseInt(strCPF.substring(9, 10), 10))
            {
                return false;
            }

            sum = 0;
            for (let aux = 1; aux <= 10; aux++)
            {
                sum += parseInt(strCPF.substring(aux - 1, aux), 10) * (12 - aux);
            }

            rest = (sum * 10) % 11;
            if ((rest === 10) || (rest === 11))
            {
                rest = 0;
            }

            if (rest === parseInt(strCPF.substring(10, 11), 10))
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        else
        {
            return false;
        }
    }

    private verifyCnpj (_document: string): boolean
    {
        const receivedCnpj = _document.trim();

        if (typeof (receivedCnpj) === "string" && this.cnpjRegex.test(receivedCnpj))
        {
            const cnpj = receivedCnpj.replace(/[^\d]+/g, "");

            if (cnpj === "")
            {
                return false;
            }

            if (cnpj.length !== 14)
            {
                return false;
            }

            // Elimina CNPJs invalidos conhecidos
            if (cnpj === "00000000000000" ||
            cnpj === "11111111111111" ||
            cnpj === "22222222222222" ||
            cnpj === "33333333333333" ||
            cnpj === "44444444444444" ||
            cnpj === "55555555555555" ||
            cnpj === "66666666666666" ||
            cnpj === "77777777777777" ||
            cnpj === "88888888888888" ||
            cnpj === "99999999999999")
            {
                return false;
            }

            // Valida DVs
            let size = cnpj.length - 2;
            let numbers = cnpj.substring(0, size);
            const digits = cnpj.substring(size);
            let sum = 0;
            let pos = size - 7;
            let result = undefined;

            for (let aux = size; aux >= 1; aux--)
            {
                sum += Number(numbers.charAt(size - aux)) * pos--;

                if (pos < 2)
                {
                    pos = 9;
                }
            }

            result = sum % 11 < 2 ? 0 : 11 - (sum % 11);

            if (result !== Number(digits.charAt(0)))
            {
                return false;
            }

            size += 1;
            numbers = cnpj.substring(0, size);
            sum = 0;
            pos = size - 7;

            for (let aux = size; aux >= 1; aux--)
            {
                sum += Number(numbers.charAt(size - aux)) * pos--;

                if (pos < 2)
                {
                    pos = 9;
                }
            }

            result = sum % 11 < 2 ? 0 : 11 - (sum % 11);

            if (result !== Number(digits.charAt(1)))
            {
                return false;
            }

            return true;
        }
        else
        {
            return false;
        }
    }
}

export { UserDocumentValidator };
