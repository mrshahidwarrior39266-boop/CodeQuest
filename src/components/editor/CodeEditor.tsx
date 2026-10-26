import React, { useEffect, useRef, useState } from 'react';
import { useLearningStore } from '../../store/useLearningStore';
import Editor from '@monaco-editor/react';
import type { CodeLanguage } from '../../engine/types';

const languageOptions: { id: CodeLanguage; label: string; ext: string; monacoLang: string }[] = [
  { id: 'javascript', label: 'JS', ext: 'js', monacoLang: 'javascript' },
  { id: 'python', label: 'Python', ext: 'py', monacoLang: 'python' },
  { id: 'cpp', label: 'C++', ext: 'cpp', monacoLang: 'cpp' },
  { id: 'java', label: 'Java', ext: 'java', monacoLang: 'java' },
];

export function CodeEditor() {
  const {
    currentLesson,
    currentStep,
    breakpoints,
    toggleBreakpoint,
    clearBreakpoints,
  } = useLearningStore();

  const [selectedLanguage, setSelectedLanguage] = useState<CodeLanguage>('javascript');

  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const decorationsRef = useRef<string[]>([]);

  const activeLine = currentStep?.line ?? -1;

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const newDecorations: any[] = [];

    // 1. Active line highlight
    if (activeLine > 0) {
      newDecorations.push({
        range: {
          startLineNumber: activeLine,
          startColumn: 1,
          endLineNumber: activeLine,
          endColumn: 1,
        },
        options: {
          isWholeLine: true,
          className: 'active-code-line',
          overviewRuler: {
            color: '#6F4E37',
            position: 1,
          },
        },
      });
      editor.revealLineInCenterIfOutsideViewport(activeLine);
    }

    // 2. Breakpoint glyphs
    breakpoints.forEach((line) => {
      newDecorations.push({
        range: {
          startLineNumber: line,
          startColumn: 1,
          endLineNumber: line,
          endColumn: 1,
        },
        options: {
          glyphMarginClassName: 'breakpoint-glyph',
          overviewRuler: {
            color: '#E6E0F0',
            position: 1,
          },
        },
      });
    });

    decorationsRef.current = editor.deltaDecorations(decorationsRef.current, newDecorations);
  }, [activeLine, breakpoints]);

  if (!currentLesson) return null;

  const currentLangObj = languageOptions.find((l) => l.id === selectedLanguage) || languageOptions[0];
  const displayedCode =
    currentLesson.languageCodes?.[selectedLanguage] || currentLesson.code;

  return (
    <div className="h-full flex flex-col" style={{ background: '#0d0804' }}>
      {/* Editor Header Bar */}
      <div
        className="flex items-center justify-between px-3 py-1.5 flex-shrink-0 flex-wrap gap-2"
        style={{
          background: '#1a130c',
          borderBottom: '1px solid rgba(110, 78, 55, 0.2)',
          minHeight: 40,
        }}
      >
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#6F4E37' }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#a8a7a5' }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#E6E0F0' }} />
          </div>

          {/* Language selector tabs */}
          <div className="flex items-center gap-1 ml-2 bg-[#120c07] p-0.5 rounded-lg border border-mocha-900/40">
            {languageOptions.map((lang) => {
              const active = selectedLanguage === lang.id;
              return (
                <button
                  key={lang.id}
                  onClick={() => setSelectedLanguage(lang.id)}
                  className="px-2 py-0.5 rounded text-[11px] font-mono font-medium transition-all"
                  style={{
                    background: active ? '#6F4E37' : 'transparent',
                    color: active ? '#E5E4E2' : '#888',
                  }}
                >
                  {lang.label}
                </button>
              );
            })}
          </div>

          <span className="text-xs font-mono font-medium hidden sm:inline" style={{ color: '#a8a7a5' }}>
            {currentLesson.id}.{currentLangObj.ext}
          </span>
        </div>

        {/* Breakpoints quick toggles */}
        <div className="flex items-center gap-1.5 text-[11px] font-mono">
          <span style={{ color: '#686765' }}>BP:</span>
          {[3, 4].map((line) => {
            const has = breakpoints.includes(line);
            return (
              <button
                key={line}
                onClick={() => toggleBreakpoint(line)}
                className="px-2 py-0.5 rounded transition-all hover:scale-105"
                style={{
                  background: has ? 'rgba(230, 224, 240, 0.2)' : 'rgba(229, 228, 226, 0.04)',
                  color: has ? '#E6E0F0' : '#686765',
                  border: has ? '1px solid #E6E0F0' : '1px solid rgba(110, 78, 55, 0.25)',
                }}
              >
                ● L{line} {line === 4 ? '(Swap)' : '(Check)'}
              </button>
            );
          })}

          {breakpoints.length > 0 && (
            <button
              onClick={clearBreakpoints}
              className="text-[10px] text-red-400 hover:underline ml-1"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Monaco editor */}
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          language={currentLangObj.monacoLang}
          value={displayedCode}
          theme="codequest-mocha"
          options={{
            readOnly: true,
            fontSize: 13.5,
            fontFamily: '"JetBrains Mono", "Fira Code", Consolas, monospace',
            fontLigatures: true,
            lineNumbers: 'on',
            glyphMargin: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            padding: { top: 14, bottom: 14 },
            renderLineHighlight: 'none',
            overviewRulerLanes: 1,
            wordWrap: 'on',
            lineHeight: 22,
            folding: false,
            smoothScrolling: true,
          }}
          beforeMount={(monaco) => {
            monacoRef.current = monaco;
            monaco.editor.defineTheme('codequest-mocha', {
              base: 'vs-dark',
              inherit: true,
              rules: [
                { token: 'keyword', foreground: 'E6E0F0', fontStyle: 'bold' },
                { token: 'string', foreground: 'd4a882' },
                { token: 'number', foreground: 'E6E0F0' },
                { token: 'comment', foreground: '686765', fontStyle: 'italic' },
                { token: 'variable', foreground: 'E5E4E2' },
                { token: 'function', foreground: 'E5E4E2', fontStyle: 'bold' },
                { token: 'operator', foreground: 'a8a7a5' },
              ],
              colors: {
                'editor.background': '#0d0804',
                'editor.foreground': '#E5E4E2',
                'editorLineNumber.foreground': '#5a3e2b',
                'editorLineNumber.activeForeground': '#E6E0F0',
                'editor.lineHighlightBackground': '#00000000',
                'editorCursor.foreground': '#E6E0F0',
                'editor.selectionBackground': '#6F4E3740',
                'editorIndentGuide.background1': '#2a1e13',
                'editorIndentGuide.activeBackground1': '#6F4E37',
                'scrollbarSlider.background': '#3d2a1c80',
                'scrollbarSlider.hoverBackground': '#5a3e2b80',
                'scrollbarSlider.activeBackground': '#6F4E3780',
              },
            });
            monaco.editor.setTheme('codequest-mocha');
          }}
          onMount={(editor, monaco) => {
            editorRef.current = editor;
            editor.onMouseDown((e: any) => {
              if (
                e.target.type === monaco.editor.MouseTargetType.GUTTER_GLYPH_MARGIN ||
                e.target.type === monaco.editor.MouseTargetType.GUTTER_LINE_NUMBERS
              ) {
                const line = e.target.position?.lineNumber;
                if (line) toggleBreakpoint(line);
              }
            });
          }}
        />
      </div>
    </div>
  );
}
