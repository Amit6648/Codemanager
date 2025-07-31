import React from 'react'
import Editoronly from './ui/Editoronly'
import { RxCross2 } from "react-icons/rx";
import { Button } from './ui/button';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

function Filecreateeditor({
    setlanguage,
    language,
    options,
    infocodesave,
    codetosave,
    setcodetosave,
    setnewfile

}) {
    return (
        <>

            <Editoronly codetosave={codetosave} setcodetosave={setcodetosave} language={language} toolbar={<div className='flex items-center justify-between'>


                <Select onValueChange={(value) => setlanguage(value)} defaultValue={language}>
                    <SelectTrigger className={'w-36'}>
                        <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent className='bg-zinc-800 text-white'>
                        {options.map((option, i) => (
                            <SelectItem key={i} value={option} className='bg-zinc-800 text-white hover:bg-zinc-700'>
                                {option}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <span className=' hover:cursor-pointer text-xl font-bold  rounded-full p-1 border hover:text-black   hover:bg-white '>
                    <RxCross2 onClick={() => setnewfile(false)} />
                </span>
            </div>} >

                <div className='flex justify-center items-center '>
                    <Button className=' bg-transparent font-semibold  p-1 px-6 rounded-lg border  text-white hover:text-black' onClick={infocodesave}>Create</Button>
                </div>
            </Editoronly>
        </>
    )
}

export default Filecreateeditor