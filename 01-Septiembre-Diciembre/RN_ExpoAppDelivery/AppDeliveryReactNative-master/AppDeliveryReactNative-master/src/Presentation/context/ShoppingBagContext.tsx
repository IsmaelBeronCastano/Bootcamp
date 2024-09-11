import { Product } from '../../Domain/entities/Product';
import { createContext, useState, useEffect } from 'react';
import { GetShoppingBagUseCase } from '../../Domain/useCases/shopping_bag/GetShoppingBag';
import { SaveShoppingBagUseCase } from '../../Domain/useCases/shopping_bag/SaveShoppingBag';

export interface ShoppingBagContextProps {
    shoppingBag: Product[],
    total: number,
    getShoppingBag(): Promise<void>,
    getTotal(): Promise<void>,
    saveItem(product: Product): Promise<void>,
    deleteItem(product: Product): Promise<void>,
}

export const ShoppingBagContext = createContext({} as ShoppingBagContextProps);

export const ShoppingBagProvider = ({children}: any) => {

    const [shoppingBag, setShoppingBag] = useState<Product[]>([])
    const [total, setTotal] = useState(0.0);

    useEffect(() => {
      getShoppingBag();
    }, [])

    useEffect(() => {
        getTotal();
    }, [shoppingBag])
    

    const getShoppingBag = async(): Promise<void> => {
        const result = await GetShoppingBagUseCase();
        setShoppingBag(result); // ASINCROZO
        
    }

    const getTotal = async (): Promise<void> => {
        setTotal(0);
        let totalPrice = 0;
        shoppingBag.forEach(product => {
            totalPrice = totalPrice + (product.quantity! * product.price);
        });
        setTotal(totalPrice);
    }

    const saveItem = async (product: Product): Promise<void> => {
        
        const index = shoppingBag.findIndex((p) => p.id == product.id);
        if (index == -1) { // PRODUCTO NO HA SIDO AGREGADO A LA BOLSA COMPRAS -> INSERTARLO A LISTA
            shoppingBag.push(product);
        }
        else { // PRODUCTO YA HA SIDO AGREGADO A LA BOLSA DE COMPRAS -> EDITAR LA CANTIDAD
            shoppingBag[index].quantity = product.quantity;
        }
        await SaveShoppingBagUseCase(shoppingBag);
        getShoppingBag();
    }

    const deleteItem = async (product: Product): Promise<void> => {
        const index = shoppingBag.findIndex((p) => p.id == product.id);
        shoppingBag.splice(index, 1);
        await SaveShoppingBagUseCase(shoppingBag);
        getShoppingBag();
    }
    
    return (
        <ShoppingBagContext.Provider value={{
            shoppingBag,
            total,
            getShoppingBag,
            getTotal,
            saveItem,
            deleteItem
        }}
        >
            {children}
        </ShoppingBagContext.Provider>
    )

}