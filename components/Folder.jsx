import React from 'react'

function Filefolder({ file, i, rename, renametrue, filefolderedit, timer, updatepath }) {
    return (
        <div key={i} className={`${rename.id === file._id && renametrue ? "bg-green-500" : "bg-yellow-700"} border flex flex-col text-white  hover:cursor-pointer p-3 rounded-xl hover:bg-yellow-600 `} onPointerDown={() => filefolderedit(file._id, file.name, file.discription)} onPointerUp={() => clearTimeout(timer.current)} onDoubleClick={() => updatepath(file._id, file.name)}>
            <p>{file.name}</p>
            <p className='text-sm text-gray-300 ' key={i}> discription - {file.discription}</p>
            <p> file type - {file.type}</p>

        </div>
    )
}

export default Filefolder