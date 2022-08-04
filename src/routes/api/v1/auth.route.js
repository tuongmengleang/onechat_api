const express = require('express');
const validator = require('../../../middlewares/validator');
const authValidation = require('../../../validations/auth.validation');
const authController = require('../../../controllers/api/v1/auth.controller');

const router = express.Router();

// router.post('/login', validate(authValidation.login), authController.login);
router.post('/login', authValidation.login, validator, authController.login);
router.post('/mobile/login', authValidation.loginUsernamePasword, validator, authController.loginUsernamePassword);
router.post('/refresh', authValidation.refresh, validator, authController.refresh);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - access_token
 *             properties:
 *               token:
 *                 type: string
 *               access_token:
 *                 type: string
 *             example:
 *               token: U2FsdGVkX19D5M1wdZgT/QS6MgiVvyBPi4895cNALPa6bjbw8Q+W7qz80vl0Nnwi8sZPGeFaMgH9W3uEWx0ztWD7ctmNIZaoMzGxxWuXDkYcuRVYxB6dpHs2S8SaT2XepIp2qwQznfHZYxI7LEltnUGOjsVBz1fJITyM+avz4JmqmTMo3JTk8/NTIR79nMU69ZkWlk5IFtlgHTgiCqQ1u/cQA7l80JIP4UObSVm4oQj1EbzE8XzLn+QCS9B6nziExxRvbqtA5JZ+pXO11xCGqIIMg/FIIOdaL2IWcmaizm9CNY3UVOfrXDCDBlePFZnQwyiwSVYRjszX0xdXiOLvIunHr9TBTu6SE8MI9WL9AWudO9mmPpSTaED99IAaEo+vG4sQKr8VPO7QGAXXe4K0Z5F59fLW5fT1bUpVohm54vOfN0iUWgjovWs4YvjVIXmrjuN4BsTLEeaiB6J5SXs79BjC6iZdon/8CwNRk5Mbt0/G2lFtDHzNkVnzzCpWMyq0sCrPxguU8q/c+L/O2cDACCtIQVpgJWCaEmqHDTsECKVUsdoZe3CDav/5wMRiL/qWd+YXgs1JQQ+uH2iuy6fJh/oZiLt42bVmN/vzAohT0+I9qwuTG5VnvhVth7Cg7E6Utr3SOQggEgcwxSbJu0Bs29j+EiiICzWX4hOqVzcnEYAZrFrm/7AbVlZxDOx7HRSseilzcf0fdJ5WXCre9uakE9t2cdtK3z1UrH55azTe5n8KYX00QDo0cYUBbyVUYnQm/yFiGNhCDHH2Ifit4kAGCYmYhks97CHjuuBNV4Hs+aofhJ+dY8AvZISmNWIWnes9D0MHQDCb/qjT20pvObpbRgAJzjgJdwt+YsfAp7BmrACOI8ub3LyQIzVd5Fxl+xuaKdFynkPz/gr1hIgBielzWQNyX32xCKApSXPausP9A1tY5we9AQ+IqAeLcTsegsKE/YUbFEdVcAKQ2Lf41zH1KDf8T5I6xUq3NwKHATl18IfDmNCEoQ6MxFRUuhJ3+lxopBKK1fllbLGfrt9k9wN6pQx1vm7KGXIBTRh+G9MjEIBrX6VBnJtPDrYT+z9iYjuDEaqMt9ipEa4m2GmCaAbofGn4w5hQT9J2ts6h8Xuk7prNha23iejkx5V0xdEbzfiujNjSFMWtaMbFk60wr9vO4jW4UgGXJ12Tqfg76AzOICUmRue6jY1oNyD5WWzsrQNcfAbVdKsg8MUNKOwGzuJgGw75HIioh7L+I5pGyrzUiT5XASTO2kxxp/59zypUqfRAUWCRsRv+cAS8DTXqiL9mBZuDzqnRb7Y0JIRlVBBQ+w4YPuMK5QB2X1lPQnFrKyP6bJ+jZcRtz9JeYwRYqA67Fj3LnR5zu/PHnM0hvgV//V9JTWjokGYgnV4pr8nHiiqAcwg1j5EfS+CV73zh2lqytub1C4N7VyjHUifNwWg/Tsu0l7PPYvgLQufycytULwbOEA0I5/t8vpLPERDrcnJqhHa0TjN3CPPrzJ9uZsN86ROKS/BeCkzT6FpCK161cMVgaYWewf1agLe/9Jtz6NSGN6m9rvSeGVvnPLnYgWbxjrZlVKNbKV61dTCBwRUQk+XAJJROFryHxtrG2wPHxcInKeAbM0wuEFIDa7Nx+5PoIE8Kxk7I3DYmprHRGpm6yXEfrkoDXprjz9hvRSY6CknL9u1V1lCqdUsts7zizIwInEWGyUJL47ZBYOJR5FAKli1DRrynTfYopIPi3pwBZrTLr3W//JnbmKfHm7YCTWZ2OwJQ6ppyWh7MeDvNLLE69BULDLRGwvU1EIo7G3bM7Ja33tM+aTl4i0WmnHAGdFmzHbw=
 *               access_token: U2FsdGVkX1/1zS8S3HxBotlLNDAjl8fnGrkV9qNyzwgSbD6AMthQeKh7+WANyWLqAQfGL3d+5M9Du7x7eEck61tkiCPJ1yuXOftuJwbek4umVrc4hVFlhDgVEJ2vvbuGNIqR49oTy/9Kbz3c7OAwlp0x0gUmahZCiMMACgIRSxhoY/jgCqJhjVjfs0CtOJNalJccLpEh2rqrCS5fQ94zmWrh/TZUleL7KhgugIRswRzyZe+GaxLYnZ7fE7uDufMEgaK/aW7HJAH0igwyZrkylEdUHo+OFhCeu2aRuJk2BcvrD5WqnfP0tHVfnLKpLvzdhF8YkqqPPNRrrHYw+X8RlanAcLMqwsoUTGjf47dkHTphe6QKo2HokL3S1ROlfW5AKCaAQbBBtHmsKYXPDAsXSvxEz4/iEGqnI5Fi/ZzgSFXPi268x7Ij/jSvObtvkQoCo500KlcwL4D2f5JSgiMASN3QoQ9wqOdZ7eNQSuwk0vVZEp6tVNrRzA00pDAoHxjK8Q+eY4X99uaGa2fNG8iZksQIpQxHSIz8esAE9n/S/+9Siiquuo7d69r+RFIFcoSZNAY2x7Lkzq1N1drGe7GRb05tt9W3P7zJ1epRqR/wDnZpU4uhhbfsNXjaWQEa7cGu9aN6wam1C5J1OJ0JZMrB6aGnfmJwfKfivS9KFwQhhmAbNkLGD75uYOrTno+vzaG45pd8mGctYoieBNoe1VzBNdhZrBTYOC9qgZXjyGB/v/eOIGLU7g4ovl0XzMeSCjfRt+iPPLZHHkfdxJETQxx5cYlayuEtoupKnGYhaLAzI1/86S7gw49NcX4W8mhKtkEd8ONmDw4gaCcLJRrinLhpbuJ3KHs/DJbzfL86exT53LzUfBLObCdqPdhGzzbZI5yuq8ycrOIqO59lQbrcjpL7Lwg5c7McLrH6TY0sUeAAWdmpxQansVfdKHS5ZfvTcEjDHodIC8qGY545ShJPtSFrupZW259PK0eObiLNWFXET4BSTDYEviwDClGKq7y7zWQvPr9YoxSh8tOFCsY7G9Vb6ZUTFe/o/XKMTEK9I+9/hQHVZZ2Pfuin8zKcKEELCKYP0tqP6lxa8GWdXvr1eSlKDSPr30GV8B4kILKruJ2b5Yyol0TJ7zZramIK4Piv03jE4vcPj44cBKMCBvMI5fXmUdW1KQRg4Hv544Bd78K790AF4gXmzjFThhrTY8sv4iMBN9bq8eUILXDjUV/hpP58lPIKkSGFvoea62+iBntLK7T5bFxNks7XLi4et94yY+F6fO1GdnT7kKK8VSwCuOmd6v9KrvzNsddCJS3Rawy8NMDqygZnsOAJThDnuwyznh5DyqZ4PV3k2sOzps3PQD4kQm1UTD/EAmOPqw+tpHC4jwT6EVOTMRyuYYfo82nSfgBKnmylptBZSBt5QdDeqWudKA==
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 */
