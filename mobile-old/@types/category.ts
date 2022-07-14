export type Category = {
    id: number,
    status: string
    user_created: string
    date_created: string
    user_updated: string
    date_updated: string
    name: string
    icon: string
    thumb: string | null
    sub_categories: SubCategory[]
}

export type SubCategory = {
    id: number,
    status: string
    user_created: string
    date_created: string
    user_updated: string
    date_updated: string
    name: string
    icon: string
    thumb: string 
    category_id: string | null
    sub_sub_categories: SubSubCatgory[]
}

export type SubSubCatgory = {
    id: number,
    status: string
    user_created: string
    date_created: string
    user_updated: string
    date_updated: string
    name: string
    icon: string
    thumb: string 
    category_id: string | null
    sub_category_id: string | null
    sub_sub_categories: SubCategory[]
}

