export class ValidationMessage {
    // 타입
    static string(key: string) {
        return `${key}:문자를 입력해야 합니다.`;
    }

    static number(key: string) {
        return `${key}:문자를 입력해야 합니다.`;
    }

    static email(key: string) {
        return `${key}:이메일 형식이 잘못되었습니다.`;
    }

    // 필수 항목
    static required(key: string) {
        return `${key}:필수 항목입니다.`;
    }

    // 길이 제한
    static maxLength(key: string, length: number) {
        return `${key}:최대 ${length}자리까지 입력 가능합니다.`;
    }

    static minLength(key: string, length: number) {
        return `${key}:최소 ${length}이상 입력 해야합니다.`;
    }

    // 숫자 제한
    static maxNumber(key: string, num: number) {
        return `${key}:최대 ${num}까지 입력 가능합니다.`;
    }

    static minNumber(key: string, num: number) {
        return `${key}:최소 ${num}이상 입력 해야합니다.`;
    }

    // 비밀번호
    static passwordRegex() {
        return /^(?=.*[A-Za-z])(?=.*[0-9])|(?=.*[A-Za-z])(?=.*[!@#$%^&*])|(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,32})$/;
    }

    static passwordMessage(key: string) {
        return `${key}:8~32자 숫자, 영문, 특수문자 중 2개 이상 조합`;
    }

    static checkPasswordMessage(key: string) {
        return `${key}:비밀번호와 일치하지 않습니다.`;
    }

    // 연락처(전화번호)
    static contactRegex() {
        return /^\d{3}-\d{3,4}-\d{4}$/;
    }

    static contactMessage(key: string) {
        return `${key}:전화번호 형식이 잘못되었습니다.`;
    }

    // 주민등록번호
    static regidentNumberRegex() {
        return /^(?:[0-9]{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12][0-9]|3[01]))-[1-4][0-9]{6}$/;
    }

    static regidentNumberMessage(key: string) {
        return `${key}:주민등록번호 형식이 잘못되었습니다.`;
    }
}
