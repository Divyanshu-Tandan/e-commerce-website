import mongoose from 'mongoose'

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        // console.log("DB Connected", mongoose.connection.host)
    } catch(error) {
        console.log(error.message)
        // Do not use process.exit(1) in Next.js, it will kill the entire dev server!
    }
}

export default connectDB
