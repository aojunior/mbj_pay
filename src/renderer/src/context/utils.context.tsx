import { useState, createContext, useContext } from "react";

type propsContext = {
    openModal: {
        modalName: string,
        open: boolean,
    }    
    toggleModal: (modalName: string, open: boolean) => void
}

const UtilsContext = createContext({} as propsContext)

export function UtilsProvider({ children }) {
    const [openModal, setOpenModal] = useState({ modalName: "", open: false });

    const toggleModal = (modalName: string, open: boolean) => {
        setOpenModal({ modalName, open });
    };

    return (
        <UtilsContext.Provider value={{ openModal, toggleModal }}>
            {children}
        </UtilsContext.Provider>
    );
}

export const useUtils = () => useContext(UtilsContext);