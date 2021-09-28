import * as Yup from "yup";
import moment from "moment";
import _ from 'lodash'

const phoneRegExp =
    /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;
const SIGN = '[\\+-]?'
const DECIMALS = '(\\.[0-9]+)?'
const ZEROS = '(\\.0+)?'
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/gif", "image/png"];

export const MasjidSchema = Yup.object().shape({
    name: Yup.string().required("Masjid name is required"),
    address: Yup.string().required("Masjid address is required"),
    latitude: Yup.number().test("is-decimal", "invalid decimal", (value) =>
        (value + "").match(`${SIGN}(90${ZEROS}|[1-8]\\d${DECIMALS}|\\d${DECIMALS})`)
    ),
    longitude: Yup.number().test("is-decimal", "invalid decimal", (value) =>
        (value + "").match(`${SIGN}(180${ZEROS}|1[0-7]\\d${DECIMALS}|[1-9]\\d${DECIMALS}|\\d${DECIMALS})`)
    ),
    gLink: Yup.string().url().required("Masjid address is required"),
    pictureURL: Yup
        .mixed()
        .test('isUndefined', "Upload An Image", value => {
            return !(_.isUndefined(value) || _.isNull(value));
        })
        .test('fileSize', "File is too large", value => {
            if (value?.size) {
                return value.size <= 9000 * 1000
            }
            return Yup.string().url().validate(value).then(value => {
                if (value) {
                    return true
                }
            })
        })
        .test('fileType', "Unsupported File format", value => {
            if (SUPPORTED_FORMATS.includes(value?.type)){
                return true
            }
            return Yup.string().url().validate(value).then(value => {
                if (value) {
                    return true
                }
            })
        })
        // .url("Not a valid url",)
        .required("Masjid's pictureURL is required"),
    userEmail: Yup.string().email().when(['userPhone', 'userName'], {
        is: (val, val2) => !_.isEmpty(val) || !_.isEmpty(val2),
        then: Yup.string().required("Masjid Admin's Email is required"),
        otherwise: Yup.string(),
    }),
    userName: Yup.string('Name must be String').when(['userPhone', 'userEmail'], {
        is: (val, val2) => !_.isEmpty(val) || !_.isEmpty(val2),
        then: Yup.string('Name must be String').required("Masjid Admin's Name is required"),
        otherwise: Yup.string('Name must be String'),
    }),
    userPhone: Yup.string()
        .matches(phoneRegExp, "Phone number is not valid")
        .min(11, "phone no. is short, please check again")
        .max(16, "phone no. is long, please check again")
        .when(['userName', 'userEmail'], {
            is: (val, val2) => !_.isEmpty(val) || !_.isEmpty(val2),
            then: Yup.string().required("Masjid Admin's Phone no. is required"),
            otherwise: Yup.string(),
        }),
    timing: Yup.object().shape({
        isha: Yup.string().test('isDateTime', 'not a valid Time', value => moment(value, 'hh:mm A').isValid()),
        fajar: Yup.string().test('isDateTime', 'not a valid Time', value => moment(value, 'hh:mm A').isValid()),
        zohar: Yup.string().test('isDateTime', 'not a valid Time', value => moment(value, 'hh:mm A').isValid()),
        asar: Yup.string().test('isDateTime', 'not a valid Time', value => moment(value, 'hh:mm A').isValid()),
        magrib: Yup.string().test('isDateTime', 'not a valid Time', value => moment(value, 'hh:mm A').isValid()),
        // jummuah: Yup.string().test('isDateTime','not a valid Time', value => moment(value, 'hh:mm A').isValid()),
    }),
}, [['userPhone', 'userEmail'], ['userPhone', 'userName'], ['userName', 'userEmail']]);
