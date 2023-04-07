const vscode = require('vscode');

/**
 * @description 입력된 숫자를 rem으로 변환하는 함수
 */
function convertToRemPx(input) {
    const pxValue = parseFloat(input) * 2; // 입력값을 실수형으로 변환하여 2를 곱함
    return `rem(${pxValue}px)`; // rem(px값) 형태로 반환
}

/**
 * @description 사용자에게 숫자를 입력하도록 요청하고, 입력된 값을 rem으로 변환하여 편집기에 삽입하는 함수
 */
async function promptForNumberAndInsertRemPx() {
    try {
        // 입력 상자를 표시하여 사용자에게 숫자를 입력하도록 요청
        const input = await vscode.window.showInputBox({
            prompt: 'rem으로 변환할 px값을 입력해주세요.😉', // 사용자에게 입력값을 요청하는 메시지
            placeHolder: '10을 입력할 경우 rem(20px)로 변환됩니다.', // 입력 예시
            validateInput: (value) => {
                return isNaN(parseFloat(value)) ? '숫자를 입력하세요.' : null; // 입력값이 숫자가 아닐 경우 에러 메시지 출력
            },
        });

        if (input === undefined) {
            // 입력값이 없을 경우 함수 종료
            return;
        }

        const remPxValue = convertToRemPx(input); // 입력값을 rem(px값) 형태로 변환
        const activeEditor = vscode.window.activeTextEditor;

        if (!activeEditor) {
            // 활성화된 편집기가 없을 경우 에러 메시지 출력
            vscode.window.showErrorMessage('활성화된 편집기가 없습니다.');
            return;
        }

        const currentSelection = activeEditor.selection; // 현재 선택된 영역 저장
        activeEditor.edit((editBuilder) => {
            editBuilder.replace(currentSelection, remPxValue); // 선택된 영역을 rem(px값)으로 대체
        });
    } catch (error) {
        vscode.window.showErrorMessage(error.message); // 에러 발생 시 에러 메시지 출력
    }
}

/**
 * @description 확장 기능이 활성화될 때 호출되는 함수
 */
function activate(context) {
    const disposable = vscode.commands.registerCommand('extension.convertRem', promptForNumberAndInsertRemPx); // 'extension.convertRem' 명령어 등록
    context.subscriptions.push(disposable); // 명령어 등록을 context.subscriptions 배열에 추가
}

/**
 * @description 확장 기능이 비활성화될 때 호출되는 함수
 */
function deactivate() {}

exports.activate = activate;
exports.deactivate = deactivate;
