import { Knex } from "knex";
export const calculateDiscount = (price: number, discountPercentage: number, decimal=0)=>{
    if(discountPercentage == 0) return price
    let discountPrice = ( price*discountPercentage ) / 100
    price-=discountPrice;
    if(decimal == 0) return Math.round(price)
    return price
}

export const verifyCouponCode = async (database: Knex, couponCode: string, productType: string): Promise<Record<string, any> | null>=>{
    try {
        const [ coupon ] = await database("coupons").where({code: couponCode, product_type: productType, status: "published"})
        return coupon;
    } catch (error) {
        return null
    }
}

export const useCouponCode = async (database: Knex, couponCode: string, productType: string, forceMultiple: boolean=false): Promise<Record<string, any> | null>=>{
    try {
        const [ coupon ] = await database("coupons").where({code: couponCode, product_type: productType, status: "published"})
        const updateFilter: Record<string, any> = {code: couponCode, product_type: productType, status: "published"}
        if(!forceMultiple) updateFilter.allow_multiple = 0
        await database("coupons").update({status: "archived"}).where(updateFilter)
        return coupon;
    } catch (error) {
        return null
    }
}