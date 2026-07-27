import FloralPlayer from "./FloralPlayer";
import MinimalistPlayer from "./MinimalistPlayer";

export default function InvitationPlayer(props: any) {
    console.log("template_id =", props.event?.template_id);
    console.log("templateId prop =", props.templateId);

    const template = props.event?.template_id ?? "floral";

    if (template === "minimalist") {
        return <MinimalistPlayer {...props} />;
    }

    return <FloralPlayer {...props} />;
}