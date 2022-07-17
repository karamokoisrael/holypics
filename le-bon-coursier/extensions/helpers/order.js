"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCouponCode = exports.verifyCouponCode = exports.calculateDiscount = void 0;
const calculateDiscount = (price, discountPercentage, decimal = 0) => {
    if (discountPercentage == 0)
        return price;
    let discountPrice = (price * discountPercentage) / 100;
    price -= discountPrice;
    if (decimal == 0)
        return Math.round(price);
    return price;
};
exports.calculateDiscount = calculateDiscount;
const verifyCouponCode = (database, couponCode, productType) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [coupon] = yield database("coupons").where({ code: couponCode, product_type: productType, status: "published" });
        return coupon;
    }
    catch (error) {
        return null;
    }
});
exports.verifyCouponCode = verifyCouponCode;
const useCouponCode = (database, couponCode, productType, forceMultiple = false) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [coupon] = yield database("coupons").where({ code: couponCode, product_type: productType, status: "published" });
        const updateFilter = { code: couponCode, product_type: productType, status: "published" };
        if (!forceMultiple)
            updateFilter.allow_multiple = 0;
        yield database("coupons").update({ status: "archived" }).where(updateFilter);
        return coupon;
    }
    catch (error) {
        return null;
    }
});
exports.useCouponCode = useCouponCode;
