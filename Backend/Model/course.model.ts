import mongoose, { Date, Document, Schema } from "mongoose";

export interface ICourseDataSchema extends Document {
    name:string,
    description:string,
    video:{
        thumbnail:{
            public_id:string,
            url:string
        },
        url:string,
        section:string,
        length:string,

    },
    links:[
        {
            title:string,
            url:string
        }
    ],
    suggestion:string[],
    questions:[
        {
            user:object,
            question:string,
            answer:object[],
            createdAt: Date

        }
    ]

}
const CourseDataSchema = new Schema<ICourseDataSchema>({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    video:{
        thumbnail:{
            public_id:{
                type:String
            },
            url:{
                type:String
            }
        },
        url:{
            type:String
        },
        section:{
            type:String
        },
        length:{
            type:Number
        },

    },
    links:[
        {
            title:{
                type:String
            },
            url:{
                type:String
            }
        }
    ],
    suggestion:[String],
    questions:[
        {
            user:Object,
            question:{
                type:String
            },
            answer:Array,
            createdAt: {
                type: Date,
                default : Date.now
            }

        }
    ]

})

export interface ICourseSchema extends Document {
    name:string,
    description:string,
    price:number,
    estimatedPrice:number,
    thumbnail:{
        public_id:string,
        url:string
    },
    tags:string[],
    level:string,
    demoUrl:string,
    benefits:string[],
    preRequisits:string[],
    purchased:number,
    reviews:[
        {
            user:object,
            comment:string,
            rating:number,
            createdAt?: Date,
            reviewReplies:object[]
        }
    ],
    courseData:object[],
    ratings:number


}

const CourseSchema = new Schema<ICourseSchema>({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    estimatedPrice:{
        type:Number
    },
    thumbnail:{
        public_id:{
            type:String
        },
        url:{
            type:String
        }
    },
    tags:{
        type:[String]
    },
    level:{
        type:String
    },
    demoUrl:{
        type:String
    },
    benefits:{
        type:[String]
    },
    preRequisits:{
        type:[String]
    },
    purchased:{
        type:Number
    },
    reviews:[
        {
            user:{
                type:Object
            },
            comment:{
                type:String
            },
            rating:{
                type:Number
            },
            createdAt: {
                type: Date,
                default : Date.now
            }, 
            reviewReplies:Array
        }
    ],
    courseData:[
        CourseDataSchema
    ],
    ratings:{
        type:Number
    }


},{
    timestamps:true
})

export const CourseModel = mongoose.model('Course',CourseSchema)

