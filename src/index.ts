import { httpServer } from "./server";

httpServer.listen(process.env.PORT || 3333, () => {
    console.log("Server listening on port " + (process.env.PORT || 3333));
})