import React from 'react'
import { Editor } from '@monaco-editor/react';

function Editoronly({
    readOnly = false,
    setcodetosave = null,
    codetosave = "",
    children,
    language = "cpp",
    toolbar

}) {
    return (


        <div className='flex flex-col gap-2 rounded-2xl  absolute bg-black/50 backdrop-blur-md p-4 '>
            {toolbar && (toolbar)}
            <div className=' h-[250px] w-[250px] md:h-[300px] md:w-[300px] lg:h-[400px] lg:w-[400px] flex items-center justify-center rounded-2xl  '>
                <Editor
                    value={codetosave}
                    height="100%"
                    width=" 100%"

                    defaultLanguage='cpp'
                    options={{
                        selectOnLineNumbers: true,
                        fontSize: 14,
                        minimap: {
                            enabled: false
                        },
                        readOnly: readOnly
                    }}
                    onMount={(editor, monaco) => {
                        editor.focus();
                    }}

                    theme="vs-dark"
                    language={language}
                    onChange={(value) => { setcodetosave(value) }}
                    className='rounded-lg'

                />
            </div>
            {children && (children)}
        </div>

    )
}

export default Editoronly