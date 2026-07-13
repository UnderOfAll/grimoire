' ── Grimoire launcher (no console window) ─────────────────────────
' Double-click to start the local server hidden and open the app in
' your browser. Nothing stays on screen.
' To stop it later, double-click "Stop Grimoire.bat".

Option Explicit
Dim sh, fso, dir, port, py
Set sh  = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

dir  = fso.GetParentFolderName(WScript.ScriptFullName)
sh.CurrentDirectory = dir
port = "8777"

' Find a Python launcher (py, then python, then python3).
py = ""
If Found("py") Then
  py = "py"
ElseIf Found("python") Then
  py = "python"
ElseIf Found("python3") Then
  py = "python3"
End If

If py = "" Then
  MsgBox "Python 3 was not found on your PATH." & vbCrLf & _
         "Install it from python.org, then try again.", vbExclamation, "Grimoire"
  WScript.Quit 1
End If

' Start the server with a hidden window (style 0); it runs until stopped.
sh.Run "cmd /c " & py & " scripts\serve.py " & port, 0, False

' Give it a moment, then open the app in the default browser.
WScript.Sleep 1200
sh.Run "http://localhost:" & port & "/index.html", 1, False

' Returns True if `exe` is on PATH (runs `where` hidden and checks exit code).
Function Found(exe)
  Found = (sh.Run("cmd /c where " & exe & " >nul 2>nul", 0, True) = 0)
End Function
