import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    // رسالة التفعيل بشكل شيك
    vscode.window.setStatusBarMessage('$(shield) نظام EyeRelax يحرس عينيك الآن', 5000);

    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.text = "$(eye) EyeRelax: Active";
    statusBarItem.command = 'eyerelax.startBreak'; 
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);

    // تسجيل الأمر يدوياً لإصلاح الخطأ الذي ظهر في exe.JPG
    let startBreakCommand = vscode.commands.registerCommand('eyerelax.startBreak', () => {
        triggerBreak(statusBarItem);
    });
    context.subscriptions.push(startBreakCommand);

    const intervalTime = 20 * 60 * 1000; // 20 دقيقة

    const timer = setInterval(() => {
        triggerBreak(statusBarItem);
    }, intervalTime);

    context.subscriptions.push({ dispose: () => clearInterval(timer) });
}

async function triggerBreak(statusBarItem: vscode.StatusBarItem) {
    // إصلاح المسافات في الأيقونة لتظهر بشكل صحيح $(screen-full)
    statusBarItem.text = "$(screen-full) خذ استراحة الآن!";
    statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');

    vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: "راحة العين (20-20-20)",
        cancellable: false
    }, async (progress) => {
        const totalSeconds = 20;
        for (let i = 0; i <= totalSeconds; i++) {
            const remaining = totalSeconds - i;
            progress.report({ 
                increment: (100 / totalSeconds), 
                message: `باقي ${remaining} ثانية.. انظر بعيداً عن الشاشة 🌿` 
            });
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        vscode.window.showInformationMessage('✅ انتهت الاستراحة، يمكنك العودة للعمل بتركيز.');
        statusBarItem.text = "$(eye) EyeRelax: Active";
        statusBarItem.backgroundColor = undefined;
    });
}

export function deactivate() {}