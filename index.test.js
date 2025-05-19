const request = require("supertest");
const express = require("express");
const { createLimiter, redisClient } = require("./limiter");
const { updateConfig, getConfig } = require("./configStore");

const helmet = require("helmet");

const app = express();
app.use(express.json());
app.use(helmet()); // Security middleware

// Rate limiter middleware
app.use(async (req, res, next) => {
    const limiter = createLimiter();
    try {
        await limiter.consume(req.ip);
        next();
    } catch {
        res.status(429).send("Too many requests - try again later.");
    }
});

app.get("/", (req, res) => {
    res.send("OK");
});


app.post("/admin/update-rate-limit", (req, res) => {
    const { points, duration, blockDuration } = req.body;
    console.log("req.body : ", req.body);
    updateConfig({ points, duration, blockDuration });
    res.status(200).json({ message: "Updated" });
});

// //Clear Redis before each test
beforeEach(async () => {
    await redisClient.flushall();
});


//Close Redis after all tests
afterAll(async () => {
    await redisClient.quit();
});


describe("Rate Limiter Tests", () => {
    test("should allow requests under limit", async () => {
        updateConfig({ points: 5, duration: 60, blockDuration: 60 });
        console.log("config: ", getConfig());
        const res = await request(app).get("/");
        expect(res.status).toBe(200);
        expect(res.text).toBe("OK");
    });

    test("should block after exceeding limit", async () => {
        updateConfig({ points: 2, duration: 60, blockDuration: 60 });
        console.log("config: ", getConfig());
        await request(app).get("/");
        await request(app).get("/");
        const res = await request(app).get("/");

        expect(res.status).toBe(429);
        expect(res.text).toContain("Too many requests");
    });
    test("should update rate limit via admin API", async () => {
        const updateRes = await request(app)
            .post("/admin/update-rate-limit")
            .send({ points: 11, duration: 60, blockDuration: 60 });
        expect(updateRes.status).toBe(200);
        expect(updateRes.body.message).toBe("Updated");

        // Should allow 10 requests now
        let allowed = 0;
        for (let i = 0; i < 10; i++) {
            const res = await request(app).get("/");
            if (res.status === 200) allowed++;
        }

        expect(allowed).toBe(10);
    });
});