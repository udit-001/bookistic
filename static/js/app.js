new Vue({
    el: '#sign-form',
    data: {
        name: null,
        nameError: null,
        email: null,
        emailError: null,
        pass: null,
        cpass: null,
        passError: null,
        cpassError: null
    },
    methods: {
        checkName: function () {
            if (this.name.length < 1) {
                this.nameError = "This is a required field.";
            } else if (/^[a-zA-Z]{1,18}$/.test(this.name)) {
                this.nameError = null;
            } else {
                this.nameError = 'Names can only contain alphabets';
            }
        },
        checkEmail: function () {
            if (this.email.length < 1) {
                this.emailError = "This is a required field.";
            } else if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.email)) {
                this.emailError = null;
            } else {
                this.emailError = 'Invalid email.';
            }
        },
        checkPass: function () {
            if (this.pass.length < 1) {
                this.passError = "This is a required field.";
            } else if (this.pass.length < 8) {
                this.passError = 'Passwords must contain atleast 8 letters.';
            } else {
                this.passError = null;
            }
        },
        checkCpass: function () {
            if (this.pass === this.cpass) {
                this.cpassError = null;
            } else {
                this.cpassError = 'Passwords do not match';
            }
        }
    },
    computed: {
        allowSubmit: function () {
            if (this.name !== null && this.email !== null && this.pass !== null && this.cpass !== null) {
                if (this.nameError === null && this.emailError === null && this.passError === null && this.cpassError === null) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    }
});