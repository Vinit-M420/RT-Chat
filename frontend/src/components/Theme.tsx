import { Sun, Moon } from 'lucide-react';
import { useThemeStore } from '../store';

const Theme = () => {
    const { isDark, setDarkMode } = useThemeStore();

    return (
        <div className='md:fixed absolute top-6 left-6 md:translate-x-0 transition duration-200
                        cursor-pointer p-2 rounded-2xl border dark:border-gray-400 border-zinc-700 
                      hover:bg-gray-200 dark:hover:bg-gray-800 
                        bg-neutral-100 dark:bg-black'
            onClick={() => {
                setDarkMode(!isDark);
            }}>
            
            {isDark ? 
                <Moon className='text-gray-100 size-6' /> :       
                <Sun className='text-gray-900  size-6' />}
        </div>
    )
}

export default Theme;