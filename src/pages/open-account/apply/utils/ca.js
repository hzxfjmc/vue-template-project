import forge from 'node-forge'

function purePEM(pem) {
    return pem
        .replace('-----BEGIN CERTIFICATE REQUEST-----', '')
        .replace('-----END CERTIFICATE REQUEST-----', '')
        .replace(/\r\n/g, '')
}

/**
 * 格式化主题字符串为一个对象
 */
function formatSubject(subjectStr) {
    const subjectArr = subjectStr.trim().split(',')
    const subject = []
    subjectArr.forEach(item => {
        if (item.indexOf('=') !== -1) {
            const itemArr = item.split('=')
            subject.push({
                shortName: itemArr[0],
                value: itemArr[1],
                valueTagClass: forge.asn1.Type.UTF8
            })
        }
    })
    return subject
}

function createPKCS1(privateKey, hash) {
    hash = forge.util.decode64(hash)
    const md = forge.md.sha256.create()
    md.update(hash)
    const signature = privateKey.sign(md)
    return forge.util.encode64(signature)
}

function createPKCS10(keys, subject, keepRaw) {
    const csr = forge.pki.createCertificationRequest()
    csr.publicKey = keys.publicKey
    csr.setSubject(subject)
    csr.sign(keys.privateKey, forge.md.sha256.create())
    const pem = forge.pki.certificationRequestToPem(csr)
    return keepRaw ? pem : purePEM(pem)
}

function createKeypair(bits, workers) {
    return new Promise((resolve, reject) => {
        try {
            forge.pki.rsa.generateKeyPair(
                {
                    bits,
                    workers
                },
                (err, keypair) => {
                    if (err) {
                        reject(`keypair 生成失败: ${err}`)
                    }
                    resolve(keypair)
                }
            )
        } catch (e) {
            reject(`keypair 生成异常: ${e}`)
        }
    })
}

function getPrivateKeyPem(key) {
    return forge.pki.privateKeyToPem(key)
}

function getPrivateKey(pem) {
    return forge.pki.privateKeyFromPem(pem)
}

// 证书生成不能用ip访问 之能是域名
const bits = 2048
const workers = 2
export const getCertP10 = async certDN => {
    try {
        let keyPair = await createKeypair(bits, workers)
        const subject = formatSubject(certDN)
        const certP10 = createPKCS10(keyPair, subject)
        const privateKeyPem = getPrivateKeyPem(keyPair.privateKey)
        return { certP10, privateKeyPem } // 根据主题生成 p10
    } catch (e) {
        console.log(certDN, e)
        return e
    }
}

export const getP1SignData = async (fileHash, privateKeyPem) => {
    try {
        const privateKey = getPrivateKey(privateKeyPem)
        return createPKCS1(privateKey, fileHash)
    } catch (e) {
        return e
    }
}
