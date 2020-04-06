const { Router } = require('express');

const router = Router();

router.get(
    '/task', async (req,res) => {
        try {
            const randomInt = Math.floor(Math.floor(2)*Math.random());
            console.log("randomInt is", randomInt);
            
            if(randomInt){
                return res.status(200).send("Task={domain:'google.com'}")
            } else {
                return res.status(200).send("Task={domain:'yandex.ru'}")
            }
        }
        catch(e) {
            res.status(500).json({
                message:'ошибка на сервере'
            })
        }
    }
)

module.exports = router;