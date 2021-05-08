<script>
    import { doc, setDoc } from "firebase/firestore";
    const updateProfile = async () => {
        await setDoc(doc(db, "cities", "LA"), {
            name: "Los Angeles",
            state: "CA",
            country: "USA",
        });
    };
</script>
