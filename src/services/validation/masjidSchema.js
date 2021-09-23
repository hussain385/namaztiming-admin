import * as Yup from "yup";
import moment from "moment";

const phoneRegExp =
    /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

export const MasjidSchema = Yup.object().shape({
    name: Yup.string().required("Masjid name is required"),
    address: Yup.string().required("Masjid address is required"),
    latitude: Yup.number().test("is-decimal", "invalid decimal", (value) =>
        (value + "").match(/^\d*\.{1}\d*$/)
    ),
    longitude: Yup.number().test("is-decimal", "invalid decimal", (value) =>
        (value + "").match(/^\d*\.{1}\d*$/)
    ),
    gLink: Yup.string().url().required("Masjid address is required"),
    pictureURL: Yup.string()
        .url("Not a valid url",)
        .required("Masjid's pictureURL is required"),
    // userEmail: Yup.string().email().required("Email is required"),
    // userName: Yup.string().required("Your name is required"),
    // userPhone: Yup.string()
    //     .matches(phoneRegExp, "Phone number is not valid")
    //     .min(11, "phone no. is short, please check again")
    //     .max(16, "phone no. is long, please check again")
    //     .required("Your Phone no. is required"),
    timing: Yup.object().shape({
        isha: Yup.string().test('isDateTime','not a valid Time', value => moment(value, 'hh:mm A').isValid()),
        fajar: Yup.string().test('isDateTime','not a valid Time', value => moment(value, 'hh:mm A').isValid()),
        zohar: Yup.string().test('isDateTime','not a valid Time', value => moment(value, 'hh:mm A').isValid()),
        asar: Yup.string().test('isDateTime','not a valid Time', value => moment(value, 'hh:mm A').isValid()),
        magrib: Yup.string().test('isDateTime','not a valid Time', value => moment(value, 'hh:mm A').isValid()),
        // jummuah: Yup.string().test('isDateTime','not a valid Time', value => moment(value, 'hh:mm A').isValid()),
    }),
});
