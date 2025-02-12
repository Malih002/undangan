import { dto } from "./dto.js";

export const HTTP_GET = 'GET';
export const HTTP_POST = 'POST';
export const HTTP_PUT = 'PUT';
export const HTTP_PATCH = 'PATCH';
export const HTTP_DELETE = 'DELETE';

export const request = (method, path) => {

    let url = document.body.getAttribute('data-url');
    let req = {
        method: method,
        headers: new Headers({
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        })
    };

    if (url.slice(-1) == '/') {
        url = url.slice(0, -1);
    }

    return {
        /**
         * @template T
         * @param {((data: any) => T)=} transform
         * @returns {Promise<ReturnType<typeof dto.baseResponse<T>>>}
         */
        send(transform = null) {
            return fetch(url + path, req)
                .then((res) => res.json())
                .then((res) => {
                    if (res.error) {
                        throw res.error[0];
                    }

                    if (transform) {
                        res.data = transform(res.data);
                    }

                    return dto.baseResponse(res.code, res.data, res.error);
                })
                .catch((err) => {
                    alert(err);
                    throw err;
                });
        },
        download() {
            return fetch(url + path, req)
                .then((res) => {
                    if (res.status === 200) {
                        return res;
                    }

                    return null;
                })
                .catch((err) => {
                    alert(err);
                    throw err;
                });
        },
        token(token) {
            if (token.split('.').length === 3) {
                req.headers.append('Authorization', 'Bearer ' + token);
                return this;
            }

            req.headers.append('x-access-key', token);
            return this;
        },
        body(body) {
            req.body = JSON.stringify(body);
            return this;
        },
    };
};
