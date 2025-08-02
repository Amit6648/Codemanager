import React from 'react'

function File({ file, i, rename, renametrue, filefolderedit, timer, opencode }) {
    return (
        <div key={i} className={`${rename.id === file._id && renametrue ? "bg-green-500" : "bg-blue-700"} border flex flex-col text-white  hover:cursor-pointer p-3 rounded-xl hover:bg-blue-600 `} onDoubleClick={() => opencode(file.code, file._id)} onPointerDown={() => filefolderedit(file._id, file.name, file.discription)} onPointerUp={() => clearTimeout(timer.current)}>
            <div>

                <p>{file.name}</p>
                <p className='text-sm text-gray-300 ' key={i}> discription - {file.discription}</p>
                <p> file type - {file.type}</p>
            </div>


        </div>
    )
}

export default File